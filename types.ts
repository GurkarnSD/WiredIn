import { Session } from "next-auth";

export interface UserSession extends Session {
  user: User;
}

type User = {
  name?: string;
  email: string;
  image?: string;
  uid: string;
  displayName: string;
  profilePic: string;
};

type UserProfile = {
  id: number;
  uid: string;
  email: string;
  displayName: string;
  title?: string | null;
  bio?: string | null;
  github?: string | null;
  profilePic: string;
  bannerPic: string;
  createdAt: Date;
  updatedAt: Date;
  following?: UserProfile[];
  followers?: UserProfile[];
  skills?: UserSkill[];
  experiences?: WorkExperience[];
  projects?: UserProject[];
  posts?: UserPost[];
  likedPosts?: UserPost[];
  comments?: PostComment[];
  responses?: CommentResponse[];
  likedComments?: PostComment[];
  likedResponses?: CommentResponse[];
  messages?: ChatMessage[];
  chatRooms?: UserChatRoom[];
};

type UserSkill = {
  id: number;
  skill?: SkillOption;
  name: string;
  learnedIn: number;
  createdAt: Date;
  updatedAt: Date;
  user?: UserProfile;
  userId: string;
  experiences?: WorkExperience[];
  projects?: UserProject[];
};

type WorkExperience = {
  id: number;
  title: string;
  company: string;
  image: string;
  description: string;
  skills?: UserSkill[];
  start: Date;
  end: Date;
  current: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: UserProfile;
  userId: string;
};

type UserProject = {
  id: number;
  title: string;
  description?: string | null;
  deployment?: string | null;
  source?: string | null;
  start: Date;
  end: Date;
  current: boolean;
  skills?: UserSkill[];
  createdAt: Date;
  updatedAt: Date;
  user?: UserProfile;
  userId: string;
};

type UserPost = {
  id: number;
  uid: string;
  text: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  user: UserProfile;
  userId: string;
  likes?: UserProfile[];
  comments?: PostComment[];
};

type PostComment = {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserProfile;
  userId: string;
  post?: UserPost;
  postId: string;
  responses?: CommentResponse[];
  likes?: UserProfile[];
};

type CommentResponse = {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserProfile;
  userId: string;
  comment?: PostComment;
  commentId: number;
  likes?: UserProfile[];
};

type UserChatRoom = {
  id: number;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
  users: UserProfile[];
  messages?: ChatMessage[];
};

type ChatMessage = {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserProfile;
  userId: string;
  chatRoom?: UserChatRoom;
  chatRoomId: string;
  attachments: string[];
};

type UserContract = {
  id: number;
  uid: string;
  title: string;
  description?: string | null;
  location?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: UserProfile;
  userId: string;
  skills: SkillOption[];
  tags: TagOption[];
  applicants?: UserProfile[];
};

type SkillOption = {
  skill: string;
  contracts?: UserContract[];
  skills?: UserSkill[];
};

type TagOption = {
  tag: string;
  contracts?: UserContract[];
};

export type {
  User,
  UserProfile,
  UserSkill,
  WorkExperience,
  UserProject,
  UserPost,
  PostComment,
  CommentResponse,
  UserChatRoom,
  ChatMessage,
  UserContract,
  SkillOption,
  TagOption,
};
