// Lab 1 - Question 3
// Pattern: Producer-Consumer (Bounded Buffer)
// Justification: The baker produces loaves into a fixed-capacity counter while
// customers consume them. A bounded buffer with semaphores enforces capacity
// (block producer when full, block consumer when empty) and prevents races.

#include <chrono>
#include <cstdlib>
#include <iostream>
#include <mutex>
#include <semaphore>
#include <thread>
#include <vector>

using namespace std::chrono;

namespace {
constexpr int CAPACITY = 20;
constexpr int POISON_PILL = -1;

// Fixed-size ring buffer.
int buffer[CAPACITY];
int inIdx = 0;
int outIdx = 0;

std::mutex mtx;

// emptySlots starts at CAPACITY (all slots free), fullSlots starts at 0.
std::counting_semaphore<CAPACITY> emptySlots(CAPACITY);
std::counting_semaphore<CAPACITY> fullSlots(0);

void pushItem(int item) {
    buffer[inIdx] = item;
    inIdx = (inIdx + 1) % CAPACITY;
}

int popItem() {
    int item = buffer[outIdx];
    outIdx = (outIdx + 1) % CAPACITY;
    return item;
}

void baker(int totalLoaves, int numCustomers) {
    for (int loafId = 1; loafId <= totalLoaves; loafId++) {
        emptySlots.acquire();
        {
            std::lock_guard<std::mutex> lock(mtx);
            pushItem(loafId);
        }
        fullSlots.release();

        // Optional: simulate baking time.
        // std::this_thread::sleep_for(1ms);
    }

    // Termination: enqueue one poison pill per customer.
    for (int i = 0; i < numCustomers; i++) {
        emptySlots.acquire();
        {
            std::lock_guard<std::mutex> lock(mtx);
            pushItem(POISON_PILL);
        }
        fullSlots.release();
    }
}

void customer(int id) {
    int consumed = 0;
    while (true) {
        fullSlots.acquire();
        int item;
        {
            std::lock_guard<std::mutex> lock(mtx);
            item = popItem();
        }
        emptySlots.release();

        if (item == POISON_PILL)
            break;

        consumed++;

        // Optional: simulate time spent consuming.
        // std::this_thread::sleep_for(500us);
    }

    // Keep output small: one line per customer.
    std::cout << "Customer " << id << " consumed " << consumed << " loaves\n";
}
} // namespace

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <numCustomers> <totalLoaves>\n";
        return 1;
    }

    int numCustomers = std::atoi(argv[1]);
    int totalLoaves = std::atoi(argv[2]);

    if (numCustomers <= 0) {
        std::cerr << "numCustomers must be positive\n";
        return 1;
    }
    if (totalLoaves < 0) {
        std::cerr << "totalLoaves must be >= 0\n";
        return 1;
    }

    std::thread bakerThread(baker, totalLoaves, numCustomers);

    std::vector<std::thread> customers;
    customers.reserve((size_t)numCustomers);
    for (int i = 0; i < numCustomers; i++) {
        customers.emplace_back(customer, i);
    }

    bakerThread.join();
    for (auto& t : customers)
        t.join();

    return 0;
}
