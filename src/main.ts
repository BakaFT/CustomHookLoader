import { RegisterHook_ember } from "./providers/ember";
import { RegisterHook_xhr } from "./providers/xhr";
export function init(context: PenguInitContext) {
  RegisterHook_ember(context)
  RegisterHook_xhr(context)
}

