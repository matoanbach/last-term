#include<iostream>
#include <thread>
#include <mutex>

std::mutex mtx;

int counter = 0;

void increment(){
    for(int i=0; i<50000; i++){
        //mtx.lock();
        std::lock_guard<std::mutex> lock(mtx);
        counter++; // shared variable
        //mtx.unlock(); 
    }
}

// race condition - 
/*
counter - 1234
t1 - incremented 1235
t2 - incremented 1235
t1 wrote back 1235
t2 wrote back 1235


*/

// Critical section - code section containing shared data - must not be accessed simultaneously

/* Data Race vs Race condition




*/


int main(){

    std::thread t1(increment);
    std::thread t2(increment);

    t1.join();
    t2.join();

    std::cout << "Total count: " << counter << std::endl;

}