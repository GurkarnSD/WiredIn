import ProfileHeader from "./ProfileHeader"
import ProfileExperience from "./ProfileExperience"
import ProfileSkills from "./ProfileSkills"
import ProfileProjects from "./ProfileProjects"
import ProfileActivity from "./ProfileActivity"

const fetchProfileUser = async (pageUser: string) => {
    const res = await fetch(`${process.env.API_URL}/api/users/?name=${pageUser}`)

    if (!res.ok) {
        throw new Error("Failed to fetch user profile")
    }

    return res.json()
}

export default async function Profile(params: { pageUser: string }) {

    const { pageUser } = params;

    const pageData = await fetchProfileUser(pageUser)

    return (
        <div>
            <ProfileHeader pageUser={pageData} />
            <ProfileExperience />
            <ProfileSkills />
            <ProfileProjects />
            <ProfileActivity />
        </div>
    )
}