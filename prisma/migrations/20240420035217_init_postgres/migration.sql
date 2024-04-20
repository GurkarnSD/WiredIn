-- CreateTable
CREATE TABLE "Credentials" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivateToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "credsId" INTEGER NOT NULL,

    CONSTRAINT "ActivateToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "resetAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "credsId" INTEGER NOT NULL,

    CONSTRAINT "ResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NameChange" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credsId" INTEGER NOT NULL,

    CONSTRAINT "NameChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "github" TEXT,
    "profilePic" TEXT NOT NULL DEFAULT 'default/Profile.png',
    "bannerPic" TEXT NOT NULL DEFAULT 'default/Banner.jpg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "learnedIn" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "image" TEXT,
    "description" VARCHAR(1000),
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "deployment" TEXT,
    "source" TEXT,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "text" VARCHAR(1200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(1200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(1200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(1200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "chatRoomId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "location" TEXT,
    "hourly" DOUBLE PRECISION,
    "salary" INTEGER,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillOption" (
    "skill" TEXT NOT NULL,

    CONSTRAINT "SkillOption_pkey" PRIMARY KEY ("skill")
);

-- CreateTable
CREATE TABLE "TagOption" (
    "tag" TEXT NOT NULL,

    CONSTRAINT "TagOption_pkey" PRIMARY KEY ("tag")
);

-- CreateTable
CREATE TABLE "_Following" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExperienceToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LikedPosts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CommentLikes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ResponseLikes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatRoomUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ContractSkills" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ContractTags" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ContractApplicants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_JobSkills" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_JobTags" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_JobApplicants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_uid_key" ON "Credentials"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_displayName_key" ON "Credentials"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_email_key" ON "Credentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ActivateToken_token_key" ON "ActivateToken"("token");

-- CreateIndex
CREATE INDEX "ActivateToken_credsId_idx" ON "ActivateToken"("credsId");

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_token_key" ON "ResetToken"("token");

-- CreateIndex
CREATE INDEX "ResetToken_credsId_idx" ON "ResetToken"("credsId");

-- CreateIndex
CREATE UNIQUE INDEX "NameChange_name_key" ON "NameChange"("name");

-- CreateIndex
CREATE INDEX "NameChange_credsId_idx" ON "NameChange"("credsId");

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");

-- CreateIndex
CREATE INDEX "Skill_userId_idx" ON "Skill"("userId");

-- CreateIndex
CREATE INDEX "Skill_name_idx" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "Experience_userId_idx" ON "Experience"("userId");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_uid_key" ON "Post"("uid");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Image_postId_idx" ON "Image"("postId");

-- CreateIndex
CREATE INDEX "Response_userId_idx" ON "Response"("userId");

-- CreateIndex
CREATE INDEX "Response_commentId_idx" ON "Response"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_uid_key" ON "ChatRoom"("uid");

-- CreateIndex
CREATE INDEX "ChatRoom_uid_idx" ON "ChatRoom"("uid");

-- CreateIndex
CREATE INDEX "Message_userId_idx" ON "Message"("userId");

-- CreateIndex
CREATE INDEX "Message_chatRoomId_idx" ON "Message"("chatRoomId");

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "Attachment"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_uid_key" ON "Contract"("uid");

-- CreateIndex
CREATE INDEX "Contract_userId_idx" ON "Contract"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_uid_key" ON "Job"("uid");

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_Following_AB_unique" ON "_Following"("A", "B");

-- CreateIndex
CREATE INDEX "_Following_B_index" ON "_Following"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExperienceToSkill_AB_unique" ON "_ExperienceToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_ExperienceToSkill_B_index" ON "_ExperienceToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToSkill_AB_unique" ON "_ProjectToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToSkill_B_index" ON "_ProjectToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LikedPosts_AB_unique" ON "_LikedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedPosts_B_index" ON "_LikedPosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommentLikes_AB_unique" ON "_CommentLikes"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentLikes_B_index" ON "_CommentLikes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ResponseLikes_AB_unique" ON "_ResponseLikes"("A", "B");

-- CreateIndex
CREATE INDEX "_ResponseLikes_B_index" ON "_ResponseLikes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatRoomUsers_AB_unique" ON "_ChatRoomUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatRoomUsers_B_index" ON "_ChatRoomUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContractSkills_AB_unique" ON "_ContractSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_ContractSkills_B_index" ON "_ContractSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContractTags_AB_unique" ON "_ContractTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ContractTags_B_index" ON "_ContractTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContractApplicants_AB_unique" ON "_ContractApplicants"("A", "B");

-- CreateIndex
CREATE INDEX "_ContractApplicants_B_index" ON "_ContractApplicants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JobSkills_AB_unique" ON "_JobSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_JobSkills_B_index" ON "_JobSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JobTags_AB_unique" ON "_JobTags"("A", "B");

-- CreateIndex
CREATE INDEX "_JobTags_B_index" ON "_JobTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JobApplicants_AB_unique" ON "_JobApplicants"("A", "B");

-- CreateIndex
CREATE INDEX "_JobApplicants_B_index" ON "_JobApplicants"("B");

-- AddForeignKey
ALTER TABLE "ActivateToken" ADD CONSTRAINT "ActivateToken_credsId_fkey" FOREIGN KEY ("credsId") REFERENCES "Credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetToken" ADD CONSTRAINT "ResetToken_credsId_fkey" FOREIGN KEY ("credsId") REFERENCES "Credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NameChange" ADD CONSTRAINT "NameChange_credsId_fkey" FOREIGN KEY ("credsId") REFERENCES "Credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_name_fkey" FOREIGN KEY ("name") REFERENCES "SkillOption"("skill") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Following" ADD CONSTRAINT "_Following_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Following" ADD CONSTRAINT "_Following_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExperienceToSkill" ADD CONSTRAINT "_ExperienceToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExperienceToSkill" ADD CONSTRAINT "_ExperienceToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToSkill" ADD CONSTRAINT "_ProjectToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToSkill" ADD CONSTRAINT "_ProjectToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedPosts" ADD CONSTRAINT "_LikedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedPosts" ADD CONSTRAINT "_LikedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentLikes" ADD CONSTRAINT "_CommentLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentLikes" ADD CONSTRAINT "_CommentLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResponseLikes" ADD CONSTRAINT "_ResponseLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResponseLikes" ADD CONSTRAINT "_ResponseLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomUsers" ADD CONSTRAINT "_ChatRoomUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomUsers" ADD CONSTRAINT "_ChatRoomUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractSkills" ADD CONSTRAINT "_ContractSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractSkills" ADD CONSTRAINT "_ContractSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "SkillOption"("skill") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractTags" ADD CONSTRAINT "_ContractTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractTags" ADD CONSTRAINT "_ContractTags_B_fkey" FOREIGN KEY ("B") REFERENCES "TagOption"("tag") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractApplicants" ADD CONSTRAINT "_ContractApplicants_A_fkey" FOREIGN KEY ("A") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractApplicants" ADD CONSTRAINT "_ContractApplicants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobSkills" ADD CONSTRAINT "_JobSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobSkills" ADD CONSTRAINT "_JobSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "SkillOption"("skill") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobTags" ADD CONSTRAINT "_JobTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobTags" ADD CONSTRAINT "_JobTags_B_fkey" FOREIGN KEY ("B") REFERENCES "TagOption"("tag") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicants" ADD CONSTRAINT "_JobApplicants_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicants" ADD CONSTRAINT "_JobApplicants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
