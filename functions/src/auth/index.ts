import { Application } from "express";
import { isAuthenticated, isAuthorized } from "./auth-guards";
import { addUser, getUser, updateUser, deleteUser, listUsers, listAllUsers } from './user-admin';

/** wizdm API routing */
export function usersAPI(app: Application, config?: { [key:string]: any }) {

	// List all users: GET /users
	app.get('/users', 
		isAuthenticated,
		isAuthorized(['admin']),
		listAllUsers
	);

	// List users by identifiers POST /users (indentifiers[])
	app.post('/users', 
		isAuthenticated,
		isAuthorized(['admin'], config && { rootEmail: config.root?.email }),
		listUsers
	);

	// Creates a new user POST /users/new (data)
	app.post('/users/new', 
		isAuthenticated,
		isAuthorized(['admin']),
		addUser
	);

	// Read a user record GET /users/uid
	app.get('/users/:uid', 
		isAuthenticated,
		isAuthorized(['admin'], { allowSameUser: true }),
		getUser
	);

	// Updates a user PATCH /users/uid (data)
	app.patch('/users/:uid', 
		isAuthenticated,
		isAuthorized(['admin'], { allowSameUser: true }),
		updateUser
	);

	// Deletes a user DELETE /users/uid
	app.delete('/users/:uid', 
		isAuthenticated,
		isAuthorized(['admin'], { allowSameUser: true }),
		deleteUser
	);
}