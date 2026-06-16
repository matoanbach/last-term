import { useContext } from "react"

import {StateContext} from "./StateContext"

export default function DisplayList() {
    const { cars, city }  = useContext(StateContext)
    const [carsList, setCarsList] = cars;
    const [cityList, setCityList] = city;

    return (
        <View key={index}>
            {
                carsList.map((ele: string, index: number) => {
                    <View key={index}>
                        <Text style={{ fontSize: 24 }}>{`${index + 1} - ${ele}`}</Text>
                    </View>
                })
            }
        </View>
    )
}