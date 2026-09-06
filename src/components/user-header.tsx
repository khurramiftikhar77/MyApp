import { ThemedText } from '@/components/themed-text';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface UserHeaderProps {
  name: string;
  onEdit: () => void;
}

export function UserHeader({ name, onEdit }: UserHeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="small" style={styles.name}>
        👤 {name}
      </ThemedText>
      <TouchableOpacity onPress={onEdit}>
        <ThemedText type="small" style={styles.edit}>
          Edit Info
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 16,
  },
  name: {
    fontWeight: '700',
  },
  edit: {
    color: '#007AFF',
    fontWeight: '700',
  },
});
