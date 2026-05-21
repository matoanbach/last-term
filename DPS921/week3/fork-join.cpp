#include <iostream>
#include <thread>
#include <vector>

std::vector<int> data = {1,2,3,4,5,6,7,8};

int parallelSum(int start, int end) {
    // base case
    if (end - start <= 2) {
        int sum = 0;
        for (int i = start; i < end; i++) 
            sum += data[i];
        
        return sum;
    }

    int mid = (start+end)/2;
    int leftSum = 0;
    int rightSum = 0;

    std::thread t1([&leftSum, start, mid](){
        leftSum = parallelSum(start, mid);
    });

    std::thread t2([&rightSum, mid, end](){
        rightSum = parallelSum(mid, end);
    });

    // join
    t1.join();
    t2.join();

    // combine
    return leftSum + rightSum;
}

int main() {
    int total = parallelSum(0, data.size());

    std::cout << "Total sum: " << total << std::endl;

    return 0;
}