import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

const dataKey = '@passmanager:logins';

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    // Get asyncStorage data, use setSearchListData and setData
    try {
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
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();

  }, []));

  function handleFilterLoginData(search: string) {
    if (search === '') {
      return;
    }
    // Filter results inside data, save with setSearchListData
    const filteredLogins = data.filter((loginInfo: LoginDataProps) => {
      return loginInfo.title.toLowerCase().includes(search.toLowerCase())
    })
    console.log(filteredLogins);
    setSearchListData(filteredLogins);

  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}