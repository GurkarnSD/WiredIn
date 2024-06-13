import { Session } from "next-auth";

export interface UserSession extends Session {
  session: number;
  userAgent: string;
  ipAddress: string;
  location: string;
  user: User;
}

type SettingsSession = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  userAgent: string;
  ipAddress: string;
  location: string;
  credentialsId: string;
};

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
  github?: string | null;
  profilePic: string;
  profileURL?: string;
  bannerPic: string;
  bannerURL?: string;
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
  _count?: {
    followers: number;
    following: number;
  };
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
  image?: string;
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
  description: string;
  deployment: string;
  source: string;
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
  _count: {
    likes: number;
    comments: number;
  };
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
  description: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserProfile;
  userId: string;
  skills: SkillOption[];
  tags: TagOption[];
  applicants?: UserProfile[];
};

type UserJob = {
  id: number;
  uid: string;
  title: string;
  description: string;
  location: string;
  hourly?: number | null;
  salary?: number | null;
  start?: Date | null;
  end?: Date | null;
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
  jobs?: UserJob[];
};

type TagOption = {
  tag: string;
  contracts?: UserContract[];
  jobs?: UserJob[];
};

export type {
  SettingsSession,
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
  UserJob,
  SkillOption,
  TagOption,
};
