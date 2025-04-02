// GlobalStyles.js
import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    alignItems: 'center',
  },
  heading1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 8,
  },
  bodyText: {
    fontSize: 16,
    color: '#555',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
