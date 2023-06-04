"use client";
import ProfileHeader from "./ProfileHeader"
import ProfileExperience from "./ProfileExperience"
import ProfileSkills from "./ProfileSkills"
import ProfileProjects from "./ProfileProjects"
import ProfileActivity from "./ProfileActivity"

export default function Profile(params: { pageUser: any, user: any }) {

    const { pageUser, user } = params;

    return (
        <div>
            <ProfileHeader pageUser={pageUser} user={user} />
            <ProfileExperience pageUser={pageUser} user={user} />
            <ProfileSkills pageUser={pageUser} user={user} />
            <ProfileProjects pageUser={pageUser} user={user} />
            <ProfileActivity pageUser={pageUser} />
        </div>
    )
}