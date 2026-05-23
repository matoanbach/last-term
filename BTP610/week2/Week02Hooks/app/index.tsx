import DisplayList from "./DisplayList";
import HookExample from "./HookExample";
import { StateProvider } from "./StateContext";
import StateExample from "./StateExample";

export default function Index() {

  return (
    // <HookExample />
    // <StateExample />
    <StateProvider>
      <DisplayList />
    </StateProvider>
  );
}
