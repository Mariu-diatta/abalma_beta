import { ButtonScrollTopDown } from "../components/ButtonScroll";
import HomeContain from "../components/HomeContain";
import HomeLayout from "../layouts/HomeLayout";

const Home = () => {

    return (

        <HomeLayout>

            <ButtonScrollTopDown>

                <HomeContain/>

            </ButtonScrollTopDown>

        </HomeLayout>
    )
}

export default Home;