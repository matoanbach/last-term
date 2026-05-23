import { useContext } from "react";
import { StateContext } from "./StateContext";
import { Text, View } from "react-native";


export default function DisplayList() {
    const { cars, city } = useContext(StateContext);
    const [carsList, setCarsList] = cars;
    const [cityList, setCityList] = city;

    const displayCars = () => {
        return carsList.map((ele: string, index: number) => {
            return(
                <View key={index}>
                    <Text style={{ fontSize: 24 }}>{`${index + 1} - ${ele}`}</Text>
                </View>
            )
        })
    }

    return <View>{displayCars()}</View>
}