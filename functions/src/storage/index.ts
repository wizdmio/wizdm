import { Application } from "express";
import { isAuthenticated, isAuthorized } from "../auth/auth-guards";
import { deleteFolder } from './folders';

/** wizdm API routing */
export function foldersAPI(app: Application, config?: { [key:string]: any }) {

	/**app.get('/folders', 
		isAuthenticated,
		isAuthorized(['admin']),
		listFolders
	);*/
	
	app.delete('/folders/:uid', 
		isAuthenticated,
		isAuthorized(['admin'], { allowSameUser: true }),
		deleteFolder
	);
}