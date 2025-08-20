const {
  notes,
  UserSharedNote,
  roles,
  user_roles,
  users,
  notifications,
} = require("../models");
const { Op } = require("sequelize");

class NoteService {
  static async populateViewersandEditors(
    viewers,
    editors,
    createdNoteId,
    userId,
    io
  ) {
    try {
      const sharedRecords = [];

      const [sharedByInfo, noteInfo] = await Promise.all([
        users.findOne({ where: { id: userId }, attributes: ["name"] }),
        notes.findOne({ where: { id: createdNoteId }, attributes: ["title"] }),
      ]);
      for (const viewerId of viewers) {
        sharedRecords.push({
          noteId: createdNoteId,
          sharedBy: userId,
          roleId: 4,
          userId: viewerId,
        });
        io.to(viewerId.toString()).emit("notify", {
          fromUserId: userId,
          message: `${sharedByInfo.name} just shared a note with title:${noteInfo.title} with you for viewing`,
        });
        await notifications.create;
      }

      for (const editorId of editors) {
        sharedRecords.push({
          noteId: createdNoteId,
          sharedBy: userId,
          roleId: 3,
          userId: editorId,
        });
        io.to(editorId.toString()).emit("notify", {
          fromUserId: userId,
          message: `${sharedByInfo.name} just shared a note with title:${noteInfo.title} with you for editing`,
        });
      }
      if (sharedRecords.length > 0) {
        await UserSharedNote.bulkCreate(sharedRecords);
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async addNote(title, content, userId, viewers, editors, io) {
    try {
      const createdNote = await notes.create({
        title,
        content,
        ownerId: userId,
      });

      await this.populateViewersandEditors(
        viewers,
        editors,
        createdNote.id,
        userId,
        io
      );

      return { id: createdNote.id };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deleteNote(id, userId, roleId) {
    try {
      const role = await this.getRoleCode(roleId, userId);
      const permissionFilter = await this.generatePermissionSearchObject(
        userId,
        role.code
      );
      const noteExists = await notes.findOne({
        where: { ...permissionFilter, id },
      });
      if (!noteExists) {
        throw new Error("Note Not found or Invalid Note deletion request");
      }
      await notes.destroy({ where: { id } });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async generatePermissionSearchObject(userId, roleCode) {
    let sharedNotes;
    switch (roleCode) {
      case "OW": // Owner
        return { ownerId: userId }; // only his notes

      case "ED":
        sharedNotes = await UserSharedNote.findAll({
          where: { userId, roleId: 3 },
          attributes: ["noteId"],
        });
        break;

      case "VW":
        sharedNotes = await UserSharedNote.findAll({
          where: { userId, roleId: 4 },
          attributes: ["noteId"],
        });
        break;

      default:
        return { ownerId: userId };
    }
    const noteIds = sharedNotes.map((sn) => sn.noteId);

    return {
      id: { [Op.in]: noteIds },
    };
  }

  static async getRoleCode(roleId, userId) {
    try {
      if (!roleId) {
        throw new Error("Role id is required");
      }
      const isUserAuthorised = await user_roles.findOne({
        where: { roleId, userId },
      });
      if (!isUserAuthorised) {
        throw new Error("Access Denied");
      }
      return await roles.findOne({
        where: { id: roleId },
        attributes: ["code"],
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getNotes(userId, roleId) {
    try {
      const role = await this.getRoleCode(roleId, userId);
      return await notes.findAll({
        where: await this.generatePermissionSearchObject(userId, role.code),
        order: [["id", "ASC"]],
        include: [
          {
            model: users,
            as: "owner",
            attributes: ["id", "name"],
          },
        ],
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getNote(id, userId, roleId) {
    try {
      const role = await this.getRoleCode(roleId, userId);
      const permissionFilter = await this.generatePermissionSearchObject(
        userId,
        role.code
      );
      const validRecord = await notes.findOne({
        where: { ...permissionFilter, id },
      });

      if (!validRecord) {
        throw new Error(
          "You do not have access to this note or it does not exist."
        );
      }

      const sharedNotes = await UserSharedNote.findAll({
        where: { noteId: id },
        attributes: ["userId", "roleId"],
      });

      const viewers = sharedNotes
        .filter((sn) => sn.roleId === 4)
        .map((sn) => sn.userId);

      const editors = sharedNotes
        .filter((sn) => sn.roleId === 3)
        .map((sn) => sn.userId);

      return { ...validRecord.toJSON(), viewers, editors };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async editNote(body, userId, updationRecordId, roleId, io) {
    try {
      const role = await this.getRoleCode(roleId, userId);
      const permissionFilter = await this.generatePermissionSearchObject(
        userId,
        role.code
      );
      const noteExists = await notes.findOne({
        where: { ...permissionFilter, id: updationRecordId },
        include: [
          {
            model: users, // your users model
            as: "owner", // must match the alias in Note.associate
            attributes: ["id"], // fetch only the creator's ID
          },
        ],
      });
      if (!noteExists) {
        throw new Error("Note Not found or Invalid Note updation request");
      }
      const { viewers, editors } = body;
      await notes.update(
        { ...body, updatedBy: userId },
        { where: { id: updationRecordId } }
      );
      const updatedByInfo = await users.findOne({
        where: { id: userId },
        attributes: ["name"],
      });

      io.to(noteExists.owner.id.toString()).emit("notify", {
        fromUserId: userId,
        message: `Your note with title: ${noteExists.title}" was updated by ${updatedByInfo.name}`,
      });

      await UserSharedNote.destroy({
        where: {
          noteId: updationRecordId,
        },
      });
      await this.populateViewersandEditors(
        viewers,
        editors,
        updationRecordId,
        userId,
        io
      );
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async listRoleBasedUsers(roleCode, userId) {
    try {
      const role = await roles.findOne({
        where: { code: roleCode },
        attributes: ["id"],
      });
      const userRoles = await user_roles.findAll({
        where: { roleId: role.id },
        include: [
          {
            model: users,
            as: "user",
            attributes: ["id", "name"],
            where: { id: { [Op.ne]: userId } }, // skip current user
          },
        ],
      });
      return userRoles.map((user) => {
        return user.user;
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = NoteService;
