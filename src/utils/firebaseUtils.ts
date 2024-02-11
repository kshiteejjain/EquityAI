import { collection, getDocs, query, where, DocumentData, QuerySnapshot, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';
type UserDocumentData = {
  total_credits?: number;
  remain_credits?: number;
  credits_limit_perday?: number;
  name?: string;
  iconPath?: string;
  categoryName?: string,
  description?: string,
  id?: number,
  redirect?: string,
  isBookmarked?: boolean,
  email?: string,
  expire_date?: string,
  isActiveUser?: boolean,
  isAdmin?: boolean,
  password?: string
};
export const fetchUserDocument = async (username: string): Promise<QuerySnapshot<DocumentData>> => {
  const collectionRef = collection(firestore, 'RegisteredUsers');
  const q = query(collectionRef, where('email', '==', username));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};
export const fetchTotalCredits = async (
  username: string,
  setTotalCredits?: React.Dispatch<React.SetStateAction<number>>,
  setRemainingCredits?: React.Dispatch<React.SetStateAction<number>>,
  setIsAdmin?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  try {
    const querySnapshot = await fetchUserDocument(username);
    if (!querySnapshot.empty) {
      // Assuming there is only one document, directly access it
      const doc = querySnapshot.docs[0];
      const data = doc?.data() as UserDocumentData;
      if (setTotalCredits) {
        setTotalCredits((prevTotalCredits) => data?.total_credits || prevTotalCredits);
      }
      if (setRemainingCredits) {
        setRemainingCredits(data?.remain_credits || 0);
      }
      if (setIsAdmin) {
        const isAdminValue = data?.isAdmin;
        setIsAdmin(isAdminValue);
      }
    } else {
      // Handle the case when no document is found
      alert('No document found for the current user');
    }
  } catch (error) {
    alert('Error querying data from Firestore: ' + error);
  }
};
export const handleCreditDecrement = async (creditValue: number) => {
  try {
    const collectionRef = collection(firestore, 'RegisteredUsers');
    const q = query(
      collectionRef,
      where('email', '==', sessionStorage.getItem("username"))
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        const updatedRemainCredits = Math.max(0, (data?.remain_credits || 0) - creditValue);
        // Update the remain_credits in Firestore
        await updateDoc(doc.ref, {
          remain_credits: updatedRemainCredits,
        });
      });
    } else {
      alert('No document found for the current user');
    }
  } catch (error) {
    alert('Error updating data in Firestore: ' + error);
  }
};
export const fetchAllCategories = async (): Promise<any> => {
  try {
    const collectionRef = collection(firestore, 'Categories');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const categoryData = querySnapshot.docs.map((doc) => ({
      name: doc.data().name,
      iconPath: doc.data().iconPath,
      subCategories: doc.data().subCategories,
    }));
    return categoryData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};
export const fetchAllForms = async (): Promise<any> => {
  try {
    const collectionRef = collection(firestore, 'FormsList');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const categoryData = querySnapshot.docs.map((doc) => ({
      name: doc.data().name,
      iconPath: doc.data().iconPath,
      categoryName: doc.data().categoryName,
      description: doc.data().description,
      id: doc.data().id,
      redirect: doc.data().redirect,
      isBookmarked: doc.data().isBookmarked
    }));
    return categoryData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};

export const fetchAllUserData = async (firestore: Firestore): Promise<UserDocumentData[]> => {
  try {
    const collectionRef = collection(firestore, 'RegisteredUsers');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const userData = querySnapshot.docs.map((doc) => ({
      access_duration_days: doc.data().access_duration_days || 0,
      credits_limit_perday: doc.data().credits_limit_perday || 0,
      name: doc.data().name,
      email: doc.data().email,
      phone: doc.data().phone,
      expire_date: doc.data().expire_date,
      isActiveUser: doc.data().isActiveUser,
      isAdmin: doc.data().isAdmin,
      register_timestamp: doc.data().register_timestamp,
      password: doc.data().password,
      remain_credits: doc.data().remain_credits || 0,
      total_credits: doc.data().total_credits || 0,
    }));
    return userData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};
export const freeTrialUsers = async (firestore: Firestore): Promise<UserDocumentData[]> => {
  try {
    const collectionRef = collection(firestore, 'FreeTrialUsers');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const userData = querySnapshot.docs.map((doc) => ({
      name: doc.data().name,
      email: doc.data().email,
      phone: doc.data().phone,
      password: doc.data().password,
      credit: doc.data().credit || 0,
      remain_credits: doc.data().remain_credits || 0,
      freeTrial: doc.data().freeTrial,
      register_timestamp: doc.data().register_timestamp,
      role: doc.data().role,
    }));
    return userData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};
export const categoryStats = async (firestore: Firestore): Promise<UserDocumentData[]> => {
  try {
    const collectionRef = collection(firestore, 'CategoryStats');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const categoryData = querySnapshot.docs.map((doc) => ({
      categoryName: doc.data().selectedCategory,
      count: doc.data().count,
    }));
    return categoryData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};