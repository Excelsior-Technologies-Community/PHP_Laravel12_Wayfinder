import ProfileController from './ProfileController'
import PostController from './PostController'
import Auth from './Auth'
const Controllers = {
    ProfileController: Object.assign(ProfileController, ProfileController),
PostController: Object.assign(PostController, PostController),
Auth: Object.assign(Auth, Auth),
}

export default Controllers