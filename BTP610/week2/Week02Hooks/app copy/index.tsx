import { StateProvider } from "./StateContext";

export default function Index() {
    return (
        <StateProvider>
            <DisplayList />
        </StateProvider>
    )
}