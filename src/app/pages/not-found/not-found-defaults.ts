export interface notFoundMsgs {

    title: string,
    e404: string,
    body: string
};

export const $defaultMsgs: notFoundMsgs = 
{
    title: "Ooops... The page you're looking for doesn't exist.",
    e404: "Error 404: file not found",
    body: "You'll be redirected in <strong>{{time}}</strong>s..."
};