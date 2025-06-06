import { useDispatch } from 'react-redux';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../../Components/firebase';
import { updateAuthTokenRedux } from '../../../Store/Common';

const provider = new GoogleAuthProvider();
const useLogin = () => {
  const dispatch = useDispatch();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      dispatch(updateAuthTokenRedux({ token }));
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };
  return { handleGoogleLogin };
};

export default useLogin;
