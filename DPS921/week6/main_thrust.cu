// #include <vector>
// #inlcude <algorithm> // for sort()
#include <thrust/device_vector.h>
#include <thrust/sort.h>
#include <stdio.h>

int main(){
    thrust::device_vector<int> v(5);

    v[0] = 9; v[1] = 4; v[2] = 2; v[3] = 3; v[4] = 1;

    //thrust::sort(v.begin(), v.end());
    int sum = thrust::reduce(v.begin(),v.end());

    for(int i=0; i<v.size(); i++){
        printf("%d ", (int)v[i]);
    }
    printf("\n");

    printf("sum: %d\n",sum);

    return 0;

}