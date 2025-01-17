type Task = {
  delay: number;
  queue: (queueDelay?: number) => unknown;
};

export function createTask(callback: Function, delay: number): Task {
  return {
    delay,
    queue: (queueDelay = 0) => setTimeout(callback, delay + queueDelay),
  };
}

export function registerTaskQueue(tasks: Task[]) {
  return tasks.map((task, i) =>
    task.queue(
      tasks
        .slice(0, i)
        .map((task) => task.delay)
        .reduce((a, b) => a + b, 0),
    ),
  );
}

export async function delay<T>(ms: number, value?: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value as T), ms);
  });
}