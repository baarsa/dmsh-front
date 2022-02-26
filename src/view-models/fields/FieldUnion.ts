import { IBooleanField } from "./IBooleanField";
import { ILinkField } from "./ILinkField";
import { IStringField } from "./IStringField";

export type FieldUnion = IStringField | IBooleanField | ILinkField;
