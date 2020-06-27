import { Request, Response } from "express";
import * as admin from 'firebase-admin'

export async function deleteFolder(req: Request, res: Response) {
  const { uid } = req.params;

  console.log('Deleting folder', uid);
  
  try {

     await admin.storage().bucket().deleteFiles({ prefix: `${uid}/` });
     return res.status(201).send({});

  } catch (err) { return res.status(500).send({ message: `${err.code} - ${err.message}` }); }
}
/*
export async function listFolders(req: Request, res: Response) {
  const { uid } = req.params;

  console.log('Listing folders', uid);

  
  try {

    const labels = await admin.storage().bucket().getFiles({});

     return res.status(201).send(labels);

  } catch (err) { return res.status(500).send({ message: `${err.code} - ${err.message}` }); }
}
*/