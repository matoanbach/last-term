#include <stdio.h>
#include <cuda_runtime.h>
/*
some portion for CPU
some portion for GPU

*/
__host__ 
void process(int* Arr, int* Brr, int* Crr, int N);

void print(int* Crr, int N);

int main(){
    int Arr[]= {1,2,3,4,5};
    int Brr[] = {10,20,30,40,60};
    int Crr[5];

    process(Arr,Brr,Crr,5);

    // Print the result
    print(Crr,5);

    return 0;
}