
import { ZodError } from "zod";
import * as path from "path";
import ejs from "ejs"
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export const formatError = (error: ZodError): any => {
  let errors: any = {};
  error.errors?.map((issue) => {
    errors[issue.path?.[0]] = issue.message;
  });

  return errors;
};

export const generateRandomNum = () => {
  return uuidv4();
};

export const renderEmailEjs = async (fileName: string, payload: any) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const html = await ejs.renderFile(
    __dirname + `/views/emails/${fileName}.ejs`,
    payload
  );
  return html;
};

export const checkDateHourDifference = (date: Date | string): number => {
  const now = moment();
  const tokenSentAt = moment(date);
  const difference = moment.duration(now.diff(tokenSentAt));
  const hoursDiff = difference.asHours();
  return hoursDiff;
};