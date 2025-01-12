import React from 'react';
import {Dimensions, Text, KeyboardAvoidingView, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardScreen from '@views/mainScreen/DashboardScreen';
import ProfileScreen from '@views/mainScreen/ProfileScreen';
import MCIcon from '@components/icon/MCIcon';
import {COLORS} from '@utils/COLORS';

const Tab = createBottomTabNavigator();
const {width: screenWidth} = Dimensions.get('window');

const BottomNavigator = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Profile') {
              iconName = 'account';
            }

            return (
              iconName && <MCIcon name={iconName} size={size} color={color} />
            );
          },
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize:
                  screenWidth > 550 ? screenWidth / 35 : screenWidth / 28,
                color: focused ? COLORS.snowColor : COLORS.white50,
                fontFamily: 'WorkSans-Regular',
              }}>
              {route.name}
            </Text>
          ),
          tabBarActiveTintColor: COLORS.snowColor,
          tabBarInactiveTintColor: COLORS.white50,
          tabBarStyle: {
            backgroundColor: COLORS.snowLight80,
            height: 60,
            paddingBottom: 10,
            borderTopEndRadius: 30,
            borderTopLeftRadius: 30,
          },
        })}>
        <Tab.Screen name="Home" component={DashboardScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
};

export default BottomNavigator;
