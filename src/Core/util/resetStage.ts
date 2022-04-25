import {runtime_currentBacklog} from "@/Core/runtime/backlog";
import {initSceneData, runtime_currentSceneData} from "@/Core/runtime/sceneData";
import {runtime_gamePlay} from "@/Core/runtime/gamePlay";
import * as _ from "lodash";
import {initState} from "@/Core/store/stage";
import {getRef} from "@/Core/store/storeRef";
import {IStageState} from "@/Core/interface/stateInterface/stageInterface";

export const resetStage = (resetBacklog: boolean) => {
    /**
     * 清空运行时
     */
    if (resetBacklog) {
        runtime_currentBacklog.splice(0, runtime_currentBacklog.length); // 清空backlog
    }
    // 清空sceneData，并重新获取
    runtime_currentSceneData.currentSentenceId = 0;
    runtime_currentSceneData.sceneStack = [];
    runtime_currentSceneData.currentScene = initSceneData.currentScene;

    // 清空所有演出和timeOut
    for (const e of runtime_gamePlay.performList) {
        e.stopFunction();
    }
    runtime_gamePlay.performList = [];
    for (const e of runtime_gamePlay.timeoutList) {
        clearTimeout(e);
    }
    runtime_gamePlay.timeoutList = [];
    runtime_gamePlay.isAuto = false;
    runtime_gamePlay.isFast = false;
    const autoInterval = runtime_gamePlay.autoInterval;
    if (autoInterval !== null) clearInterval(autoInterval);
    runtime_gamePlay.autoInterval = null;
    const fastInterval = runtime_gamePlay.fastInterval;
    if (fastInterval !== null) clearInterval(fastInterval);
    runtime_gamePlay.fastInterval = null;
    const autoTimeout = runtime_gamePlay.autoTimeout;
    if (autoTimeout !== null) clearInterval(autoTimeout);
    runtime_gamePlay.autoTimeout = null;

    // 清空舞台状态表
    const initSceneDataCopy = _.cloneDeep(initState);
    for (const k in initSceneDataCopy) {
        if (initSceneDataCopy.hasOwnProperty(k)) {
            getRef('stageRef')!.current!.setStage(k as keyof IStageState, initSceneDataCopy[k as keyof IStageState]);
        }
    }
};
