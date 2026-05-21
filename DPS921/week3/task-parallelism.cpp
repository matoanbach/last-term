#include <iostream>
#include <thread>

void task(std::string activity) {
    std::cout << activity << "..." << std::endl;
}

int main() {
    std::thread t1(task, "Download File");
    std::thread t2(task, "Play Music");

    t1.join();
    t2.join();

    return 0;
}