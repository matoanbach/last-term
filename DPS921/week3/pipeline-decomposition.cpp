#include <iostream>
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>

// Producer, Processor, Consumer

std::queue<int> q1, q2;
// data will be flow throught these queues
// - q1 holds raw data
// - q2 holds processed data

std::mutex mtx1, mtx2;
std::condition_variable cv1, cv2;
bool doneProducing = false;
bool doneProcessing = false;

void producer() { // generate numbers 1, 2, 3, 4, 5
    for(int i=1;i<5;i++) { 
        std::unique_lock<std::mutex> lock(mtx1);
        q1.push(i);
        std::cout << "Produced: " << i << std::endl;
        lock.unlock();
        cv1.notify_one();
    }
    // signal completion
    std::unique_lock<std::mutex> lock(mtx1);
    doneProducing = true;
    cv1.notify_all();
}

void processor() {
    while (true) {
        std::unique_lock<std::mutex> lock1(mtx1);
        cv1.wait(lock1, []{ return !q1.empty() || doneProducing; });
        if(q1.empty() && doneProducing) break;

        int x = q1.front();
        q1.pop();
        lock1.unlock();

        int result = x*x;

        std::unique_lock<std::mutex> lock2(mtx2);
        q2.push(result);
        std::cout << "Processed: " << result << std::endl;
        lock2.unlock();
        cv2.notify_one();
    }

    // signal the consumer that no more items will arrive
    {
        std::lock_guard<std::mutex> lock(mtx2);
        doneProcessing = true;
    }
    cv2.notify_all();
}

void consumer() {
    while (true) {
        std::unique_lock<std::mutex> lock(mtx2);
        cv2.wait(lock, []{ return !q2.empty() || doneProcessing; });
        if (q2.empty() && doneProcessing) break;

        std::cout << "Consumed: " << q2.front() << std::endl;
        q2.pop();
    }
}

int main() {
    std::thread t1(producer);
    std::thread t2(processor);
    std::thread t3(consumer);

    t1.join();
    t2.join();
    t3.join();

    std::cout << "Pipeline finished." << std::endl;
    return 0;
}
