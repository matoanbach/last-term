import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Task = {
  id: number;
  title: string;
  status: 'due' | 'done';
};

export default function Index() {
  const [title, setTitle] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextTaskId, setNextTaskId] = useState<number>(1);

  const EmptyList = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Tasks Found</Text>
      <Text style={styles.emptyText}>Add a task above to display it here.</Text>
    </View>
  );

  const addTask = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      Alert.alert('Error!', 'Please enter task title');
      return;
    }

    const newTask: Task = {
      id: nextTaskId,
      title: trimmedTitle,
      status: 'due',
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setNextTaskId(nextTaskId + 1);
    setTitle('');
  };

  const toggleTaskStatus = (id: number) => {
    const updatedTasks: Task[] = tasks.map((currentTask) => {
      if (currentTask.id === id) {
        return {
          ...currentTask,
          status: currentTask.status === 'due' ? 'done' : 'due',
        };
      }

      return currentTask;
    });

    setTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedTasks = tasks.filter((currentTask) => currentTask.id !== id);
          setTasks(updatedTasks);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ToDo App</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a task title"
          autoCapitalize="sentences"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>ADD TASK</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.fullWidth}
        data={tasks}
        keyExtractor={(item: Task) => { return item.id.toString() }}
        ListEmptyComponent={EmptyList}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        renderItem={({ item }) => {
          const isDone = item.status === 'done';

          return (
            <View style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={[styles.taskStatus, isDone ? styles.statusDone : styles.statusDue]}>
                  Status: {item.status}
                </Text>
              </View>

              <View style={styles.actions}>
                <View style={styles.switchGroup}>
                  <Text style={styles.switchLabel}>{isDone ? 'Done' : 'Due'}</Text>
                  <Switch value={isDone} onValueChange={() => toggleTaskStatus(item.id)} />
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    width: '100%',
    paddingVertical: 10,
  },
  formCard: {
    paddingVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
    marginVertical: 10,
  },
  addButton: {
    width: '50%',
    backgroundColor: '#dddddd',
    alignItems: 'center',
    paddingVertical: 10,
    alignSelf: 'center',
  },
  addButtonText: {
    fontSize: 18,
  },
  fullWidth: {
    width: '100%',
  },
  emptyState: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  separator: {
    height: 10,
  },
  taskCard: {
    borderWidth: 1,
    padding: 10,
  },
  taskInfo: {
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 20,
  },
  taskStatus: {
    fontSize: 16,
  },
  statusDue: {
    color: 'red',
  },
  statusDone: {
    color: 'green',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 16,
  },
});
