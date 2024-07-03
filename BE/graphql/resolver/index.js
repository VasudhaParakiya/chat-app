import { merge } from "lodash";

import userResolver from "./user";
import messageResolver from "./message";
import groupResolver from "./group";

const resolvers = merge(userResolver, messageResolver, groupResolver);

export default resolvers;
