import { dirname } from "path";

export const DataDirectory = dirname(require.main?.filename ?? "") + "\\data";
