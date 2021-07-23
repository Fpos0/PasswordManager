
import React, { ReactNode, useContext, useState, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

interface StorageProviderProps {
  children: ReactNode;
}

interface FormData {
  title: string;
  email: string;
  password: string;
}

interface IStorageContextData {
  searchListData: LoginListDataProps;
  handleFilterLoginData: (search: string) => void;
  data: LoginListDataProps;
  getLoginData(): Promise<void>;
  setLoginData(formData: FormData): Promise<void>;
}

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

const StorageContext = createContext({} as IStorageContextData);

const dataKey = '@passmanager:logins';

function StorageProvider({ children }: StorageProviderProps) {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function getLoginData() {
    try {
      // await AsyncStorage.removeItem(dataKey);
      const response = await AsyncStorage.getItem(dataKey);
      if (!response) return;
      const logins = JSON.parse(response);
      console.log(logins);

      setSearchListData(logins);
      setData(logins);
    } catch (error) {
      console.log(error)
    }


  }
  function handleFilterLoginData(search: string) {
    if (search === '') {
      return;
    }

    const filteredLogins = data.filter((loginInfo: LoginDataProps) => {
      return loginInfo.title.toLowerCase().includes(search.toLowerCase())
    })
    console.log(filteredLogins);
    setSearchListData(filteredLogins);
  }
  async function setLoginData(formData: FormData) {
    const newLoginData = {
      id: String(uuid.v4()),
      ...formData
    }


    const data = await AsyncStorage.getItem(dataKey);
    console.log(data);
    if (data) {
      const currentData = JSON.parse(data);

      const dataUpdated = [
        ...currentData,
        newLoginData
      ];

      console.log(JSON.stringify(dataUpdated));
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataUpdated));

    } else {
      const firstData = [
        newLoginData
      ]
      console.log(JSON.stringify(firstData));
      await AsyncStorage.setItem(dataKey, JSON.stringify(firstData));
    }
  }
  return (
    <StorageContext.Provider value={{
      searchListData,
      handleFilterLoginData,
      data,
      getLoginData,
      setLoginData
    }}>
      {children}
    </StorageContext.Provider>
  )
}

function useStorage() {
  const context = useContext(StorageContext);

  return context;
}

export { StorageProvider, useStorage }