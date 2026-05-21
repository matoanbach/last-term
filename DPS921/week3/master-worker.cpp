#include <iostream>
#include <thread>
#include <queue>
#include <mutex>
#include <chrono>

// task queue
std::queue<int> tasks;
std::mutex mtx;

// master - generate tasks
void master(int numTasks) {
    for (int i = 1; i < numTasks; i++) {
        // simulate of real workload
        std::this_thread::sleep_for(std::chrono::microseconds(100));

        std::lock_guard<std::mutex> lock(mtx);
        tasks.push(i);
        std::cout << "Master assigned task " << i << std::endl;
    }
    
}

// worker: processes tasks
void worker(int id) {
    while (true) {
        int task;
        std::this_thread::sleep_for(std::chrono::microseconds(200));
        {
            std::lock_guard<std::mutex> lock(mtx);
            if(tasks.empty())
                return;

            task = tasks.front();
            tasks.pop();
        }
        std::cout << "Worker " << id << " processing task " << task << std::endl;
    }
}

int main() {
    std::thread masterThread(master, 10);
    std::vector<std::thread> workers;
    for (int i = 0; i < 3; i++){
        workers.push_back(std::thread(worker, i));
    }

    masterThread.join();
    for(auto &t: workers) {
        t.join();
    }
    
    
    return 0;
}