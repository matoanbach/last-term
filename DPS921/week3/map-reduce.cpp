#include <iostream>
#include <vector>
#include <mutex>
#include <map>
#include <thread>

std::vector<std::string> words = {"cat", "dog", "cat", "bird", "dog", "cat"};

std::vector<std::pair<std::string, int>> mappedData;
std::mutex mtx;

// Map-Reduce Programming
// -- MAP PHASE --
void mapTask(int start, int end) {
    std::vector<std::pair<std::string,int>> local;

    // generates (cat,1), (dog, 1), (cat, 1)
    for (int i = start; i < end; i++){
        local.push_back({words[i],1});
    }
    {
        std::lock_guard<std::mutex> lock(mtx);    
        std::copy(local.begin(), local.end(), std::back_inserter(mappedData));
    }
}

// -- SHUFFLE --
std::map<std::string, std::vector<int>> shuffleData() {
    std::map<std::string, std::vector<int>> grouped;
    for (auto &p: mappedData) {
        grouped[p.first].push_back(p.second);
    }
    return grouped;
}

// -- REDUCE --
void reduceTask(std::map<std::string, std::vector<int>> &grouped) {
    std::cout << "Final Reduced Output: \n";
    for (auto & p: grouped) {
        int sum = 0;
        for (int val: p.second)
            sum += val;
        
        std::cout << p.first << " : " << sum << std::endl;
    }
    
}


int main() {
    int n = words.size();
    int mid = n/2;
    // MAP PHASE in parallel
    std::thread t1(mapTask, 0, mid);
    std::thread t2(mapTask, mid, n);

    t1.join();
    t2.join();

    // SHUFFLE
    auto grouped = shuffleData();
    
    // REDUCE PHASE
    reduceTask(grouped);
    return 0;
}