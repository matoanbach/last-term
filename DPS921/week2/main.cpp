#include <thread>
#include <iostream>
#include <chrono>

using namespace std;

void f() {
    cout << "Hello from thread " << this_thread::get_id() << "\n";
    this_thread::sleep_for(chrono::seconds(2));
}

int main(int argc, char **argv) {
    thread t(f);
    cout << "Main thread waiting ..." << endl;
    t.join();
    return 0;
}
