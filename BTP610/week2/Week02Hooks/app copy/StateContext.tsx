import {createContext, useState} from "react";

export const StateContext = createContext({})

export const StateProvider = (props: any) => {
    const [expensiveCars, setExpensiveCars] = useState([
        "Rolls Royce Boattail",
        "Pagani Zonda",
        "Bugattin Divo",
        "Ferrario 250 GTO",
        "Mercedes Benz AMG"
    ])

    const [city, setCity] = useState([
        "Toronto",
        "Montreal",
        "Vancouver",
        "Boston",
        "Burlington",
        "London"
    ])

    return (
        <StateContext.Provider value={{
            cars: [expensiveCars, setExpensiveCars],
            city: [city, setCity]
        }}>
            {props.children}
        </StateContext.Provider>
    )
}