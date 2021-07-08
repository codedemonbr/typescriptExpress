import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";

export class UserRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "UserRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/users`)
            .get(UsersController.listUsers)
            .post(
                UsersMiddleware.validateRequiredUserBodyField,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createUser
            );

        this.app.param(`userId`, UsersMiddleware.extractUserId);
        this.app
            .route(`/users/:userId`)
            .all(UsersMiddleware.validateUserExists)
            .get(UsersController.getUserById)
            .delete(UsersController.removeUser);
        this.app.put(`/users/:userId`, [
            UsersMiddleware.validateRequiredUserBodyField,
            UsersMiddleware.validateSameEmailBelongToSameUser,
            UsersController.put,
        ]);
        this.app.patch(`/users/:userId`, [
            UsersMiddleware.validatePatchEmail,
            UsersController.patch,
        ]);
        return this.app;
    }
}
