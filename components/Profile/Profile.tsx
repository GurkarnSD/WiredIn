import ProfileHeader from "./ProfileHeader"
import ProfileExperience from "./ProfileExperience"
import ProfileSkills from "./ProfileSkills"
import ProfileProjects from "./ProfileProjects"
import ProfileActivity from "./ProfileActivity"

export default function Profile() {

    return (
        <div>
            <ProfileHeader />
            <ProfileExperience />
            <ProfileSkills />
            <ProfileProjects />
            <ProfileActivity />
        </div>
    )
}