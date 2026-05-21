#include <iostream>
#include <thread>
#define BLOCKDIVISION

const int SIZE = 8;
int grid[SIZE][SIZE];

void process_rows(int start, int end) {
    for (int i = start; i < end; i++){
        for (int j = 0; j < SIZE; j++){
            grid[i][j] += 1;
        }
    }
}


void process_block(int row_starts, int row_end, int col_start, int col_end) {
    for (int i = row_starts; i < row_end; i++){
        for (int j = col_start; j < col_end; j++){
            grid[i][j] += 1;
        }
    }
}

int main(){
#ifndef BLOCKDIVISION
    std::thread t1(process_rows, 0, SIZE/2);
    std::thread t2(process_rows, SIZE/2, SIZE);

    t1.join();
    t2.join();
#else
    // split into 4 quadrangs (2x2 blocks)
    std::thread t1(process_block, 0, 4, 0, 4); // top left
    std::thread t2(process_block, 0, 4, 4, 8); // top right
    std::thread t3(process_block, 4, 8, 0, 4); // bottom left
    std::thread t4(process_block, 4, 8, 4, 8); // bottom right
    
    t1.join();
    t2.join();
    t3.join();
    t4.join();

#endif
    return 0;
}