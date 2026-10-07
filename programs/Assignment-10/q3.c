#include <stdio.h>

void printNumbers(int start, int end, int choice)
{
    if (start > end)
        return;

    if (choice == 1 && start % 2 == 0)
        printf("%d ", start);

    if (choice == 2 && start % 2 != 0)
        printf("%d ", start);

    printNumbers(start + 1, end, choice);
}

int main()
{
    int start, end, choice;

    printf("Enter starting value: ");
    scanf("%d", &start);

    printf("Enter ending value: ");
    scanf("%d", &end);

    printf("\n1. Even numbers");
    printf("\n2. Odd numbers");

    printf("\nEnter your choice: ");
    scanf("%d", &choice);

    printf("\nResult: ");

    printNumbers(start, end, choice);

    return 0;
}
