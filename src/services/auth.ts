import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

export interface Employee {
  id: string;
  username: string;
  role: string;
}

export const registerEmployee = async (
  email: string,
  password: string,
  role: string = 'employee'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      username: email,
      role: role,
    });
    return user;
  } catch (error) {
    console.error('Error registering employee:', error);
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    return { ...user, role: userData?.role };
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

export const signOutUser = () => signOut(auth);

export const getEmployees = async (): Promise<Employee[]> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    username: doc.data().username,
    role: doc.data().role,
  }));
};

export const deleteEmployee = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
  // Note: This doesn't delete the user from Firebase Auth. You may want to implement that as well.
};

export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('ログインエラー:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('ログアウトエラー:', error);
    throw error;
  }
};
