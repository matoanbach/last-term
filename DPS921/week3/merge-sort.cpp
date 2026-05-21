#include <iostream>
#include <thread>
#include <vector>
#include <algorithm>

void merge_sort(std::vector<int> &arr, int left, int right) {
    if (right-left <= 1)
        return;
    
    int mid = (left+right)/2;
    std::thread t1(merge_sort, std::ref(arr), left, mid);
    std::thread t2(merge_sort, std::ref(arr), mid, right);

    t1.join();
    t2.join();

    // merge
    std::inplace_merge(arr.begin() + left, arr.begin()+mid, arr.begin()+right);
}