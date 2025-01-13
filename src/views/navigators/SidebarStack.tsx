import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {StyleSheet} from 'react-native';
import {COLORS} from '@utils/COLORS';
import DashboardScreen from '@views/mainScreen/DashboardScreen';
import PunchEntryScreen from '@views/entry/PunchEntryScreen';
import PunchApprovalScreen from '@views/approval/PunchApprovalScreen';
import CustomDrawer from '@components/CustomDrawer';
import ProfileScreen from '@views/mainScreen/ProfileScreen';
import LeaveInformationScreen from '@views/leaveInfo/LeaveInformationScreen';

const Drawer = createDrawerNavigator();

const routes = [
  {
    id: 1,
    route: 'Dashboard',
    component: DashboardScreen,
  },
  {
    id: 2,
    route: 'Punch Entry',
    component: PunchEntryScreen,
  },
  {
    id: 3,
    route: 'Punch Approval',
    component: PunchApprovalScreen,
  },
  {
    id: 4,
    route: 'My Profile',
    component: ProfileScreen,
  },
  {
    id: 5,
    route: 'Leave Information',
    component: LeaveInformationScreen,
  },
];

const SidebarStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {backgroundColor: COLORS.snowColor},
        headerTintColor: COLORS.white,
        headerTitleStyle: styles.headerTitle,
      }}
      //@ts-ignore
      drawerContent={props => <CustomDrawer {...props} />}>
      {routes?.map(item => {
        return (
          <Drawer.Screen
            key={item?.id}
            name={item?.route}
            component={item?.component}
            options={{
              headerShown: false,
              headerTitle: item?.route,
            }}
          />
        );
      })}
    </Drawer.Navigator>
  );
};
const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default SidebarStack;
