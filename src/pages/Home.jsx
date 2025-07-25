import HomeContain from "../components/Home";
import SuspenseCallback from "../components/SuspensCallback";
import HomeLayout from "../layouts/HomeLayout";

const Home = () => {

    return (

        <SuspenseCallback>

            <HomeLayout>

                <HomeContain/>

            </HomeLayout>

        </SuspenseCallback>
    )
}

export default Home;