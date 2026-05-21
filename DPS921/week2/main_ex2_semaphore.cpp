/*
Restaurant 
- some are producing food - cooks or backers
- some are consuming food - customers


producer ->    [____________________________________]   -> consumer




*/

// semaphore basic tool - primitive tool that can help manages access to resource (food) and coordination 

// Semaphore - two operations 
// P (wait/derement) - try to acquire the resource. if empty count is 0 the wait
// V (signal/increment) - release the resource, possibly waiking up the threds
#include <iostream>
#include <semaphore>
#include <mutex>

#include <thread>

#include <chrono>

std::mutex mutobj;

const int BUFFSIZE = 100;

class Resource {
    int id;
public:
    Resource(int i=0): id(i){}
    int getId() const { return id; }
};

Resource produce(int id){
    return Resource(id);
}

void consume(Resource r){
    std::cout << "Consumed resurce: " << r.getId() << std::endl;
}

Resource buffer[BUFFSIZE];

int in = 0,
out = 0;

std::counting_semaphore<BUFFSIZE> slotsAvailable(BUFFSIZE);

std::counting_semaphore<BUFFSIZE> resAvailable(0);


class Producer{
        int startId;
    public:
        Producer(int id = 0): startId(id){}
        void operator()(){
            int resourceId = startId;
            while(true){
                Resource item = produce(resourceId++);
                slotsAvailable.acquire(); // wait for empty slot
                {
                    std::lock_guard<std::mutex> lock(mutobj);   
                    buffer[in] = item;

                    in = (in + 1) % BUFFSIZE;
                }
                resAvailable.release(); // signal availablity of item or resource
            }
        }
};

class Consumer{
    public:
        void operator()(){
            while(true){
                resAvailable.acquire();
                Resource item(0);
                {
                    std::lock_guard<std::mutex> lock(mutobj);   
                    item = buffer[out];
                    out = (out + 1) % BUFFSIZE;

                } 
                slotsAvailable.release(); 
                consume(item);

            }

        }
};


int main(){
    std::thread producers[2];
    std::thread consumers[2];

    for(int i=0; i<2; i++){

        producers[i] = std::thread(Producer(i*100));
        consumers[i] = std::thread(Consumer());
    }

    for(int i=0; i<2; i++){

        producers[i].join();
        consumers[i].join();
    }


    // 

}




