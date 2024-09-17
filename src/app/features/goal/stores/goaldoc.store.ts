import { computed, inject } from '@angular/core';
import { concatMap, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { GoalService } from '../services/goal.service';
import { Goal } from '../models/goal';
import { Goaldoc } from '../models/goaldoc';

type GoalState = {
    id: number,
    goals: Array<Goaldoc>;
    habitCount: number;
    habitMatrix: Array<any>;
    isLoading: boolean;
};

const initialState: GoalState = {
    id: 0,
    goals: new Array<Goaldoc>(),
    habitCount: 0,
    habitMatrix: new Array<any>(),
    isLoading: false,
};

export const GoaldocStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ goals }) => ({
        goaldocsCount: computed(() => goals().length),
        goaldocsList: computed(() => goals())
    })),
    withMethods((store, goalService = inject(GoalService)) => ({
        setGoaldocId(goaldocid: number): void {
            patchState(store, { id: goaldocid });
        },
        getGoals: rxMethod<void>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                switchMap(() => {
                    return goalService.getGoals().pipe(
                        tapResponse({
                            next: (goals: Array<Goaldoc>) => {
                                patchState(store, { goals })
                                // patchState(store, { habitCount: goalService.getHabitCount(goals) })
                                patchState(store, { habitMatrix: goalService.getProgress(goals) })
                                console.log(store.habitMatrix())
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        // saveProject: rxMethod<any>(
        //     pipe(
        //         tap(() => patchState(store, { isSavingProject: true })),
        //         switchMap((project: any) => {
        //             return projectService.putProject(project).pipe(
        //                 tapResponse({
        //                     next: (res: any) => {
        //                         patchState(store, { project: project })
        //                         // replace updated project
        //                         patchState(store, (state: any) => ({ project: state.projects.splice(state.projects.findIndex((item: any) => project.id == item.id), 1, project) }))
        //                         if (project.id)
        //                             projectService.getProjectById(project.id)
        //                     },
        //                     error: console.error,
        //                     finalize: () => {
        //                         patchState(store, { isSavingProject: false })
        //                     }
        //                 })
        //             );
        //         })
        //     )
        // ),
        saveGoaldoc: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((goaldoc: Goaldoc) => {
                    return goalService.putGoaldoc(goaldoc).pipe(
                        tapResponse({
                            next: () => {
                                // patchState(store, { goals: goaldoc })
                                // replace updated goaldoc
                                // patchState(store, (state: any) => ({ goals: state.goals.splice(state.goals.findIndex((item: Goaldoc) => goaldoc.id == item.id), 1, goaldoc) }))

                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        // addGoaldoc: rxMethod<any>(
        //     pipe(
        //         tap(() => patchState(store, { isLoading: true })),
        //         concatMap((goaldoc: Goaldoc) => {
        //             return goaldocService.postGoaldoc(goaldoc).pipe(
        //                 tapResponse({
        //                     next: (res: Goaldoc) => {
        //                         store.goaldocs().push(res)
        //                     },
        //                     error: console.error,
        //                     finalize: () => patchState(store, { isLoading: false }),
        //                 })
        //             );
        //         })
        //     )
        // ),
        // deleteGoaldoc: rxMethod<number>(
        //     pipe(
        //         tap(() => patchState(store, { isLoading: true })),
        //         concatMap((id) => {
        //             return goaldocService.deleteGoaldoc(id).pipe(
        //                 tapResponse({
        //                     next: (res: any) => {
        //                         // remove deleted from store
        //                         patchState(store, (state: any) => ({ goaldocs: state.goaldocs.filter((goaldoc: Goaldoc) => goaldoc.id !== id) }))
        //                     },
        //                     error: console.error,
        //                     finalize: () => patchState(store, { isLoading: false }),
        //                 })
        //             );
        //         })
        //     )
        // )
    }))
);