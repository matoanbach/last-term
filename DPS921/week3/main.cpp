#include <iostream>
#include <thread>
#include <vector>

long long partial_sum(std::vector<int>& arr, int begin, int end){
    long long sum = 0;
    for (int i = begin; i < end; i++) {
        sum += arr[i];
    }
    return sum;
}

int main() {
    std::vector<int> arr(1000000, 1);
    long long sum1 = 0, sum2 = 0;
    std::thread t1(
        [&sum1, &arr](){
            sum1 = partial_sum(arr, 0, arr.size()/2);
        }
    );

    std::thread t2(
        [&sum2, &arr](){
            sum2 = partial_sum(arr, arr.size()/2, arr.size());
        }
    );

    t1.join();
    t2.join();

    std::cout << "Sum = " << sum1 + sum2 << std::endl;
    return 0;
}
